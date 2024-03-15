import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth, AuthDocument } from './schema/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {CONSTANTS}  from '../../utils/constants';
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
        role:CONSTANTS.ROLES[2]
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
      // console.log('data:====service ', data);
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

      const accessToken = this.jwtService.sign(userObject);
      console.log('accessToken: ', accessToken);
      if(accessToken){
        
        const dataToken:any=  await this.redisService.setToken(userObject.userId, accessToken);
        console.log('dataToken: ', dataToken);
        
      
          // await this.redisService.getClient().set(userObject.userId.toString(), accessToken);
        }
        
          const getToken:any=await this.redisService.getToken(userObject.userId);
          console.log('getToken: ', getToken);
        

      console.log('userObject: ', userObject);

      return { message: "Login Successfully", userObject, Token: accessToken };
    } catch (error) {
      throw error;
    }
  }
}
