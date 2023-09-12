type EmployeeStatus = 'Active' | 'Inactive' | 'Unpaid leave' ;
type Budget = {
    debit : number ,
    credit : number
}
enum Salaries {
    Intern = 1000 ,
    Low = 1500 ,
    Average = 3000 ,
    High = 4500 ,
    Maximum = 9000 ,
    Ultimate = 18000 
}
enum DepartmentDomainArea {
    SubscriberDepartment = 'Subscriber department' ,
    TechnicalSupport = 'Technical support' ,
    MaterialsDepartment = 'Materials department' ,
    ServerRoom = 'Server room' ,
    Bookkeeping = 'Financial transactions'
}
function ExternalPayment ( paymentInformation : number , money : number ) : true {
    return true ;
}

class Compamy {
    _name : string = 'Company name' ;
    _bookkeeping : Bookkeeping = new Bookkeeping ( this , 'Bookkeeping' , DepartmentDomainArea.Bookkeeping , 100000 ) ; // в компании есть бухгалтер

    _listOfDepartments : Department[] = [] ;
    _listOfPreEmployee : PreEmployee[]= [] ;
    _listOfAllDepartmentEmployee : Employee[] = [] ;

    constructor () {
        this.addDepartments ( this._bookkeeping ) ;
    }

    getOfAllDepartmentEmployee () : Employee[] {
        return this._listOfAllDepartmentEmployee ;
    }
    getOfOfPreEmployee () : PreEmployee[] {
        return this._listOfPreEmployee ;
    }
    getOfDepartments () : Department[] {
        return this._listOfDepartments ;
    }
    getName () : string {
        return  this._name ;
    }

    // пересчёт сотрудников всех департаментов
    recountOfAllDepartmentEmployee () : void {
        this._listOfAllDepartmentEmployee = this._listOfDepartments.flatMap ( ( value : Department ) => value._listOfEmployee ) ;
    }

    // добавление департамента в компанию, взятие на баланс бухгалтером и пересчёт
    addDepartments ( department : Department ) : void {
        this._bookkeeping.takeToBalanceDepartment ( department ) ;
        this.recountOfAllDepartmentEmployee () ;
    }
    removeDepartments ( department : Department ) : void {
        this._bookkeeping.removeToBalanceDepartment ( department ) ;
        this.recountOfAllDepartmentEmployee () ;
    }
}

class Department {
    _name : string ;
    _domainArea : DepartmentDomainArea ;
    _listOfEmployee : Employee[] = [] ;
    _budget : Budget = {
        credit : 0 ,
        debit : 0
    };

    constructor (
        name : string ,
        domainArea : DepartmentDomainArea ,
        budgetDebet : number
    ) {
        this._name = name ;
        this._domainArea = domainArea ;
        this._budget.debit = budgetDebet ;
    }

    getName () : string {
        return this._name ;
    }
    getCurrentBalance () : Budget {
        return this._budget ;
    }

    // перевод стажера в работники и взятие на баланс департамента
    changeOfSalaryFund ( employee : Employee , addRemove : 'add' | 'remove' ) {
        if ( addRemove === 'add' ) {
            const newBudgetDebit = employee._salary + this._budget.debit ;
            if ( newBudgetDebit > this._budget.debit ) {
                this._budget.credit = newBudgetDebit - this._budget.debit ;
                this._budget.debit = newBudgetDebit ;
            }
            else {
                this._budget.debit = newBudgetDebit ;
            }
        }
        else {
            if ( this._budget.credit > 0 ) {
                if ( this._budget.credit >= employee._salary ) {
                    this._budget.credit -= employee._salary ;
                }
                else {
                    this._budget.debit -= ( employee._salary - this._budget.credit ) ;
                    this._budget.credit = 0 ;
                }
            }
        }
    }
    addEmployee ( preEmployee : PreEmployee , salary ?: Salaries ) : void {
        const newEmployee = new Employee ( preEmployee , this , salary ) ;
        this._listOfEmployee.push ( newEmployee ) ;
        this.changeOfSalaryFund ( newEmployee , 'add' ) ;
    }
    removeEmployee ( employee : Employee ) : boolean {
        const position = this._listOfEmployee.findIndex ( value => value.getNameSurname() === employee.getNameSurname() ) ;
        if ( position >= 0 ) {
            this._listOfEmployee.splice ( position , 1 ) ;
            this.changeOfSalaryFund ( employee , 'remove' ) ;
            return true ;
        }
        else {
            return false ;
        }
    }
}

class PreEmployee {
    _name : string ;
    _surname : string ;
    _salary : number ;
    _paymentInformation : number ;

    constructor (
        name : string ,
        surname : string ,
        salary : number ,
        paymentInformation : number
    ) {
        this._name = name ;
        this._surname = surname ;
        this._salary = salary ;
        this._paymentInformation = paymentInformation ;
    }

    getNameSurname () : string {
        return `${this._name} ${this._surname}` ;
    }
}

class Employee {
    _name : string ;
    _surname : string ;
    _salary : number ;
    _money : number = 0 ;
    _paymentInformation : number ;
    _status : EmployeeStatus = 'Active';
    _department : Department ;

    constructor (
        preEmployee : PreEmployee ,
        department : Department ,
        newSalary ?: Salaries
    ) {
        this._name = preEmployee._name ;
        this._surname = preEmployee._surname ;
        this._salary = newSalary ? newSalary : preEmployee._salary ;
        this._paymentInformation = preEmployee._paymentInformation ;
        this._department = department ;
    }

    getNameSurname () : string {
        return `${this._name} ${this._surname}` ;
    }

    setSalary ( salary : number ) : void {
        this._salary = salary ;
    }
    setPaymentInformation ( paymentInformation :  number ) : void {
        this._paymentInformation = paymentInformation ;
    }
    setStatus ( status : EmployeeStatus ) : void {
        this._status = status ;
    }

    // получение зарплаты
    receivingASalary () : boolean {
        this._money += this._salary ;
        return true ;
    }
}

class Bookkeeping extends Department {
    _company : Compamy ;
    _globalBudget : Budget = {
        credit : 0 ,
        debit : 10000000
    }
    _listOfDepartments : Department[] = [] ;

    constructor ( company : Compamy , name : string , domainArea : DepartmentDomainArea.Bookkeeping , cash : number ) {
        super ( name , domainArea , cash ) ;

        this._company = company ;
    }

    // добавление стажеров на общий баланс
    changeOfSalaryGlobalFund ( employee : PreEmployee , addRemove : 'add' | 'remove' ) {
        if ( addRemove === 'add' ) {
            const newBudgetDebit = employee._salary + this._globalBudget.debit ;
            if ( newBudgetDebit > this._globalBudget.debit ) {
                this._globalBudget.credit = newBudgetDebit - this._globalBudget.debit ;
                this._globalBudget.debit = newBudgetDebit ;
            }
            else {
                this._globalBudget.debit = newBudgetDebit ;
            }
        }
        else {
            if ( this._globalBudget.credit > 0 ) {
                if ( this._globalBudget.credit >= employee._salary ) {
                    this._globalBudget.credit -= employee._salary ;
                }
                else {
                    this._globalBudget.debit -= ( employee._salary - this._globalBudget.credit ) ;
                    this._globalBudget.credit = 0 ;
                }
            }
        }
    }
    takeToBalancePreEmployee ( preEmployee : PreEmployee ) : void {
        this._company._listOfPreEmployee.push ( preEmployee ) ;
        this.changeOfSalaryGlobalFund ( preEmployee , 'add' ) ;
    }
    removeFromBalancePreEmployee ( preEmployee : PreEmployee ) : boolean {
        const position = this._company._listOfPreEmployee.findIndex ( value => value.getNameSurname() === preEmployee.getNameSurname() ) ;
        if ( position >= 0 ) {
            this._company._listOfPreEmployee.splice ( position , 1 ) ;
            this.changeOfSalaryGlobalFund ( preEmployee , 'remove' ) ;
            return true ;
        }
        else {
            return false ;
        }
    }

    // добавление на баланс департамента
    changeOfBalanceDepartment ( department : Department , takeRemove : 'take' | 'remove' ) : boolean {
        if ( takeRemove === 'take' ) {
            this._listOfDepartments.push ( department ) ;
        
            this._globalBudget.credit += department._budget.credit ;
            this._globalBudget.debit += department._budget.debit ;
            return true ;
        }
        else {
            const position = this._listOfDepartments.findIndex ( value => value.getName() === department.getName() ) ;
            if ( position >= 0 ) {
                this._listOfDepartments.splice ( position , 1 ) ;

                this._globalBudget.credit -= department._budget.credit ;
                this._globalBudget.debit -= department._budget.debit ;
                return true ;
            }
            else {
                return false ;
            }
        }
    }
    takeToBalanceDepartment ( department : Department ) : void {
        this._company._listOfDepartments.push ( department ) ;
        this.changeOfBalanceDepartment ( department , 'take' ) ;
    }
    removeToBalanceDepartment ( department : Department ) : boolean {
        this.changeOfBalanceDepartment ( department , 'remove' ) ;

        const position = this._company._listOfDepartments.findIndex ( value => value.getName() === department.getName() ) ;
        if ( position >= 0 ) {
            this._company._listOfDepartments.splice ( position , 1 ) ;
            return true ;
        }
        else {
            return false ;
        }
    }

    // поиск и выплата зарплат сотрудникам и стажерам(через внешний сервис, в данном случае функцию)
    findEmployee ( department : Department , anyEmployee : Employee | PreEmployee ) : Employee | PreEmployee | undefined {
        if ( anyEmployee instanceof Employee ) {
            const currentDepartment = this._listOfDepartments.find ( value => value.getName() === department.getName() ) ;
            const currentEmployee = currentDepartment?._listOfEmployee.find ( value => value.getNameSurname() === anyEmployee.getNameSurname() ) ;

            return currentEmployee ;
        }
        else {
            const currentEmployee = this._company._listOfPreEmployee.find ( value => value.getNameSurname() === anyEmployee.getNameSurname() ) ;

            return currentEmployee ;
        }
    }
    salaryPayment ( department : Department , employee : Employee | PreEmployee ) : boolean {
        const pay = this.findEmployee ( department , employee ) ;

        if ( pay instanceof Employee ) {
            return pay.receivingASalary () ;
        }
        else if ( pay instanceof PreEmployee ) {
            return ExternalPayment ( pay._paymentInformation , pay._salary ) ;
        }
        else {
            return false ;
        }
    }
}