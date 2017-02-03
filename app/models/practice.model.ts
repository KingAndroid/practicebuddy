export class PracticeModel {
    constructor
      (
        public id: string,
        public Date: string,
        public Name: string,
        public PracticeLength: number,
        public Comment: string,
        public Archive: boolean,
        public Track: string,
        public TeacherEmail: string,
        public StudentId: string
      )
      {}   
}