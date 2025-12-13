// src/models/SolicitudAmistad.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Usuario } from "./Usuario";

@Entity("solicitudes_amistad")
export class SolicitudAmistad {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudesEnviadas)
    usuario1!: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudesRecibidas)
    usuario2!: Usuario;

  @Column({
        type: "simple-enum",
        enum: ["pendiente", "aceptada", "rechazada", "cancelada"],
        default: "pendiente",
    })
    estado_solicitud!: string;
}
