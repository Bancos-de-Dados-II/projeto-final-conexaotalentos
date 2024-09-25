import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import * as yup from "yup";
import { models } from "mongoose";
import { resourceLimits } from "worker_threads";

interface CustomRequest extends Request {
  userId?: string;
}

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(6).required()
      });
      await schema.validate(req.body);

      const { email, password } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const user = new User({ email, password });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d"
      });

      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1d"
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  },

  getProfile: async (req: CustomRequest, res: Response) => {
    try {
      const user = await User.findById(req.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  updateProfile: async (req: CustomRequest, res: Response) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { email, password } = req.body;
      if (email) user.email = email;
      if (password) user.password = password;

      await user.save();
      res.status(200).json({ message: "Perfil atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  deleteProfile: async (req: CustomRequest, res: Response) => {
    try {
      const user = await User.findByIdAndDelete(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  patchProfile: async (req: CustomRequest, res: Response) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { email, password } = req.body;

      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }

      await user.save();
      res.status(200).json({ message: "Perfil atualizado parcialmente com sucesso" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

export default authController;