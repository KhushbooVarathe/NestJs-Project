import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({})
export class Auth {
    @Prop(
        { required: true }
    )
    firstName: string;

    @Prop(
        { required: true }
    )
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    address: string;

    @Prop()
    city: string;

    @Prop()
    role: string;

}

export const AuthSchema = SchemaFactory.createForClass(Auth);
