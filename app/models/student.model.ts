export class StudentModel {
    constructor
      (
        public id: string,
        public AdminPassword: string,
        public Date: string,
        public Instrument: number, 
        public Name: string,
        public PracticeLength: number,        
        public PracticesCompleted: number,
        public PracticesRequired: number,        
        public Reward: string,
        public TeacherEmail: string,
        public NotifyAll: boolean  
      )
      {}   
}