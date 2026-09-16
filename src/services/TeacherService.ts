import {AppDataSource} from '@/models/datasource'
import TeacherEntity from '@/models/entities/TeacherEntity.js'

const TeacherRepository = AppDataSource.getRepository(TeacherEntity)

export function createTeacher(name: string, email: string, password : string){
    const newTeacher = new TeacherEntity();
    newTeacher.name = name;
    newTeacher.email = "john@teacher.com";
    newTeacher.password = "12345678";
    try {
        TeacherRepository.save(newTeacher);
    }catch (e) {
        console.log(e)
    }
}


