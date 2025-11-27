// src/models/Local.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Degustacion } from "./Degustacion";
import { LikeLocal } from "./LikeLocal";


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

  @OneToMany(() => LikeLocal, (like) => like.local)
  likes!: LikeLocal[];

  @OneToMany(() => Degustacion, (deg) => deg.local)
    degustaciones!: Degustacion[];
}
