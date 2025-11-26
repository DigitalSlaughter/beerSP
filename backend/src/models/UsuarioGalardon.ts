// src/models/UsuarioGalardon.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Usuario } from "./Usuario";

@Entity("usuarios_galardones")
export class UsuarioGalardon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  galardonId!: string; // ID del catálogo EIF

  @Column()
  nivel!: number;

  @Column()
  fecha_obtencion!: Date;

  @ManyToOne(() => Usuario, (user) => user.galardonesAsignados)
  usuario!: Usuario;
}
