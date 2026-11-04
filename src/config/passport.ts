import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { AppDataSource } from "@/models/datasource.js";
import UserEntity from "@/models/entities/UserEntity.js";

const userRepository = AppDataSource.getRepository(UserEntity);


passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await userRepository.findOneBy({ email: email });

                if (!user) {
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

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET as string,
            issuer: process.env.JWT_ISSUER,
        },
        async (payload, done) => {
            try {
                const userId = Number(payload.sub);
                const user = await userRepository.findOneBy({ userId: userId });

                if (!user) {
                    return done(null, false, { message: "Benutzer nicht gefunden." });
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

export default passport;