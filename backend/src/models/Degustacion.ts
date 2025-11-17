// src/models/Degustacion.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Cerveza } from "./Cerveza";
import { Local } from "./Local";

@Entity("degustaciones")
export class Degustacion {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.degustaciones)
    usuario!: Usuario;

  @ManyToOne(() => Cerveza, (cerveza) => cerveza.degustaciones)
    cerveza!: Cerveza;

  @ManyToOne(() => Local, (local) => local.degustaciones, { nullable: true })
    local!: Local;

  @Column({ type: "float", nullable: true })
    puntuacion!: number;

  @Column({ type: "text", nullable: true })
    comentario!: string;

  @CreateDateColumn()
    fecha!: Date;

  @Column()
    pais_degustacion!: string;

  @Column({ default: false })
    me_gusta!: boolean;
}
