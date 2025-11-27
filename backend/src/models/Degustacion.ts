import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany
} from "typeorm";
import { Usuario } from "./Usuario";
import { Cerveza } from "./Cerveza";
import { Local } from "./Local";
import { ComentarioDegustacion } from "./ComentarioDegustacion";

@Entity("degustaciones")
export class Degustacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, usuario => usuario.degustaciones)
  usuario!: Usuario;

  @ManyToOne(() => Cerveza, cerveza => cerveza.degustaciones)
  cerveza!: Cerveza;

  @ManyToOne(() => Local, local => local.degustaciones, { nullable: true })
  local!: Local;

  @Column({ type: "float", nullable: true })
  puntuacion!: number;

  @OneToMany(() => ComentarioDegustacion, (comentario) => comentario.degustacion, {
    cascade: true,
  })
  comentarios!: ComentarioDegustacion[];

  @CreateDateColumn()
  fecha!: Date;

  @Column()
  pais_degustacion!: string;
}
