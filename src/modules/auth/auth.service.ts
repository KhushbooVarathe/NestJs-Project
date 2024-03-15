import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth, AuthDocument } from './schema/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CONSTANTS } from '../../utils/constants';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,

  ) { }

  async create(createAuthDto: CreateAuthDto): Promise<string> {
    try {

      // Check if the user with the provided email already exists
      const existingUser = await this.authModel.findOne({ email: createAuthDto.email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Check if the user with the provided mobile number already exists
      const existingMobileNumber = await this.authModel.findOne({ number: createAuthDto.number });
      if (existingMobileNumber) {
        throw new ConflictException('This Mobile number is already registered');
      }
      const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

      // Create a new user instance with the hashed password
      const newUser = new this.authModel({
        ...createAuthDto,
        password: hashedPassword,
        role: CONSTANTS.ROLES[2]
        // Replace the plain text password with the hashed one
      });

      await newUser.save();
      return 'User Registered successfully';
    } catch (error) {
      if (error.name == 'ConflictException') {
        throw (error.response);
      }
      throw new Error('Internal Server Error');
    }
  }

  async login(data: any): Promise<object> {
    try {
      const { email } = data;
      const user: any = await this.authModel.find({ email }).exec();
      console.log('user: ', user);

      if (!user || user.length === 0) {
        console.log("error");
        throw new UnauthorizedException("Invalid Email");
      }

      const isPasswordValid = await bcrypt.compare(data.password, user[0].password);
      // console.log('isPasswordValid: ', isPasswordValid);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid Password");
      }

      const userObject = {
        userId: user[0]._id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        number: user[0].number
      };

      let accessToken: any;
      let RefreshToken: any;
      const IsTokenExists: any = await this.redisService.searchKey(userObject.userId)

      if (IsTokenExists == 1) {
        const getToken: any = await this.redisService.getToken(userObject.userId);
        let isVarified: any = await this.verifyRefreshToken(userObject.userId, getToken)

        if (isVarified == true) {
          RefreshToken = getToken;
          accessToken = await this.jwtService.sign(userObject);
        } else {
          const deleteToken: any = await this.redisService.deleteToken(userObject.userId)
          if (deleteToken == 1) {
            RefreshToken = await this.jwtService.sign(userObject, { expiresIn: '2m' })
            if (RefreshToken) {
              await this.redisService.setToken(userObject.userId, RefreshToken);
            }
            accessToken = await this.jwtService.sign(userObject);
          }
        }
      } else {
        RefreshToken = await this.jwtService.sign(userObject, { expiresIn: '2m' })
        if (RefreshToken) {
          console.log('RefreshToken:NEW GENEERATED IN ELSE OF IS EXISTS ');
          await this.redisService.setToken(userObject.userId, RefreshToken);
        }
        accessToken = await this.jwtService.sign(userObject);
      }

      return { message: "Login Successfully", userObject, Token: accessToken, refreshToken: RefreshToken };
    } catch (error) {
      throw error;
    }
  }


  async verifyRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    console.log('userId: ', userId);
    const stringPart = userId.toString();
    console.log('stringPart: ', stringPart);
    try {
      const decodedToken = this.jwtService.verify(refreshToken);

      // If verification fails or the token doesn't contain expected user data, return false
      if (!decodedToken || !decodedToken.userId || decodedToken.userId !== stringPart) {
        return false;
      }
      // If all checks pass, return true indicating a valid refresh token
      return true;
    } catch (error) {
      // Handle errors or invalid tokens here
      console.error('Error verifying refresh token:', error);
      return false;
    }
  }


}
