import { Request, Response } from "express";
import Job, { IJob } from "../models/Job";

const jobController = {
 
  createJob: async (req: Request, res: Response) => {
    console.log(req.body); // Verifique o que está sendo recebido
    try {
      const { title, description, company, location } = req.body;
      const job = new Job({ title, description, company, location });
      await job.save();
      res.status(201).json(job);
    } catch (error) {
        console.error("Erro ao criar vaga:", error); // Verifique erros
        res.status(500).json({ message: (error as Error).message });
    }
},

  getJobs: async (req: Request, res: Response) => {
    try {
      const jobs = await Job.find();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  getJobById: async (req: Request, res: Response) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  updateJob: async (req: Request, res: Response) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }

      const { title, description, company, location } = req.body;
      if (title) job.title = title;
      if (description) job.description = description;
      if (company) job.company = company;
      if (location) job.location = location;

      await job.save();
      res.status(200).json({ message: "Vaga atualizada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  deleteJob: async (req: Request, res: Response) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }
      res.status(200).json({ message: "Vaga excluída com sucesso" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  patchJob: async (req: Request, res: Response) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }

      const { title, description, company, location } = req.body;

      if (title) job.title = title;
      if (description) job.description = description;
      if (company) job.company = company;
      if (location) job.location = location;

      await job.save();
      res.status(200).json({ message: "Vaga atualizada parcialmente com sucesso" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

export default jobController;
