const sequelize = require("../db");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { Sequelize, Model } = require("sequelize");

class User extends Model {
    static async findByEmailAndPassword(email, password) {
        try {
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) throw new Error("Incorrect credentials");
            const isMatched = await compare(password, user.password);
            if (!isMatched) throw new Error("Incorrect credentials");
            return user;
        } catch (err) {
            throw err;
        }
    }

    static async generateToken() {
        const secretKey = `${this.getDataValue("email")}-${new Date(
            this.getDataValue("createdAt")
        ).getTime()}`;
        const token = await sign({ id: this.getDataValue("id") }, secretKey, {
            expiresIn: (1000 * 60 * 10).toString()
        });
        this.setDataValue("accessToken", token);
        await this.save();
    }
}

const userSchema = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accessToken: {
        type: Sequelize.STRING
    }
};

User.init(userSchema, {
    sequelize: sequelize,
    tableName: 'Users'
})

User.beforeCreate(async user => {
    // const secretKey = `anuraggothi`;
    // console.log(user.id)
    // const accessToken = await sign({ id: user.id }, secretKey, {
    //     expiresIn: (1000 * 60 * 10).toString()
    // });
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    // user.accessToken = accessToken
});

User.beforeUpdate(async user => {
    if (user.changed("password")) {
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
    }
});

module.exports = User;
