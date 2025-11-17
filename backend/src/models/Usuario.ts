// src/models/Usuario.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { SolicitudAmistad } from "./SolicitudAmistad";
import { Degustacion } from "./Degustacion";
import { Galardon } from "./Galardon";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ unique: true })
    nombre_usuario!: string;

  @Column({ unique: true })
    correo!: string;

  @Column()
    password!: string;

  @Column({ default: false })
    validada!: boolean;

  @Column({ nullable: true })
    tokenVerificacion?: string;

  @Column({ nullable: true })
    foto!: string;

  @Column({ nullable: true })
    nombre!: string;

  @Column({ nullable: true })
    apellidos!: string;

  @Column({ nullable: true })
    ubicacion!: string;

  @Column({ nullable: true })
    genero!: string;

  @Column({ nullable: true })
    pais!: string;

  @Column({ nullable: true })
    fecha_nacimiento!: string;

  @Column({ nullable: true })
    texto_introduccion!: string;

  // Relaciones
  @OneToMany(() => SolicitudAmistad, (solicitud) => solicitud.usuario1)
    solicitudesEnviadas!: SolicitudAmistad[];

  @OneToMany(() => SolicitudAmistad, (solicitud) => solicitud.usuario2)
    solicitudesRecibidas!: SolicitudAmistad[];

  @OneToMany(() => Degustacion, (deg) => deg.usuario)
    degustaciones!: Degustacion[];

  // Galardones (EIF): solo en memoria, no se persiste
    galardones?: Galardon[];
}
