import UserEntity from "@/models/entities/UserEntity.js"
import {AppDataSource} from "@/models/datasource.js";

const UserRepository = AppDataSource.getRepository(UserEntity);

function initUserRegister(email: string){

}