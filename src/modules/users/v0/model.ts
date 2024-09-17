// models/User.ts
// models/User.ts
export interface User {
  id_user: string;                 // character varying(50)
  email: string;              // character varying(100)
  username: string;           // character varying(50)
  name: string;               // character varying(50)
  firstname: string;          // character varying(50)
  lastname: string;           // character varying(50)
  phone: string;              // character varying(15)
  genero: string;             // character varying(30)
  active: boolean;            // boolean
  date_create: Date;          // date
  date_update: Date;          // date
}



