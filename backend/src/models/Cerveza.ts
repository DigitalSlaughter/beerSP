// src/models/Cerveza.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Degustacion } from "./Degustacion";

@Entity("cervezas")
export class Cerveza {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ unique: true })
    nombre_cerveza!: string;

  @Column()
    estilo!: string;

  @Column()
    pais_procedencia!: string;

  @Column()
    size!: string;

  @Column()
    formato!: string;

  @Column("float")
    porcentaje_alcohol!: number;

  @Column("float")
    amargor!: number;

  @Column()
    color!: string;

  @Column({ type: "text", nullable: true })
    descripcion!: string;

  @Column({ nullable: true })
    foto!: string;

  @Column({ default: false })
    favorito!: boolean;

  @OneToMany(() => Degustacion, (deg) => deg.cerveza)
    degustaciones!: Degustacion[];
}
