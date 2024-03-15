import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';
export type RegisterDocument = HydratedDocument<Register>;

@Schema({
    timestamps:true
})
export class Register {
    @Prop(
        { required: true }
    )
    firstName: string;

    @Prop(
        { required: true }
    )
    lastName: string;

    @Prop({ unique: [true,'duplicate email'] })
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





export const RegisterSchema = SchemaFactory.createForClass(Register);
