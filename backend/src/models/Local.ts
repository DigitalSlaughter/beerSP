// src/models/Local.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Degustacion } from "./Degustacion";

@Entity("locales")
export class Local {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ unique: true })
    nombre_local!: string;

  @Column()
    direccion!: string;

  @Column({ nullable: true })
    coordenadas!: string;

  @Column({ default: false })
    me_gusta!: boolean;

  @OneToMany(() => Degustacion, (deg) => deg.local)
    degustaciones!: Degustacion[];
}
