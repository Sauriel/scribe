import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  constructor(firstName: string, lastName: string, age: number) {
    this.id = -1;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}
