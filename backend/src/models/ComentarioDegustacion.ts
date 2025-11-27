// src/models/ComentarioDegustacion.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Degustacion } from "./Degustacion";

@Entity("comentarios_degustacion")
export class ComentarioDegustacion {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: "text" })
    texto!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.comentariosDegustacion, {
    eager: true,
  })
    usuario!: Usuario;

  @ManyToOne(() => Degustacion, (deg) => deg.comentarios, {
    onDelete: "CASCADE",
  })
    degustacion!: Degustacion;

  @CreateDateColumn()
    fecha!: Date;
}
