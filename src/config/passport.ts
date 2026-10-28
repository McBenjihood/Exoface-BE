import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { AppDataSource } from "@/models/datasource.js";
import UserEntity from "@/models/entities/UserEntity.js";

passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const userRepository = AppDataSource.getRepository(UserEntity);
                const user = await userRepository.findOneBy({email:email});

                if (!user) {
                    console.log("User wurde in DB nicht gefunden!");
                    return done(null, false, { message: "Ungültige E-Mail oder ungültiges Passwort." });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: "Ungültige E-Mail oder ungültiges Passwort." });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

export default passport;