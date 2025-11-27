// src/models/LikeLocal.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Local } from "./Local";

@Entity("likes_local")
export class LikeLocal {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.likesLocal, {
    eager: true,
  })
    usuario!: Usuario;

  @ManyToOne(() => Local, (local) => local.likes, {
    onDelete: "CASCADE",
  })
    local!: Local;

  @CreateDateColumn()
    fecha!: Date;
}
