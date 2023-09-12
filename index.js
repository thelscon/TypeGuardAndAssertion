var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Salaries;
(function (Salaries) {
    Salaries[Salaries["Intern"] = 1000] = "Intern";
    Salaries[Salaries["Low"] = 1500] = "Low";
    Salaries[Salaries["Average"] = 3000] = "Average";
    Salaries[Salaries["High"] = 4500] = "High";
    Salaries[Salaries["Maximum"] = 9000] = "Maximum";
    Salaries[Salaries["Ultimate"] = 18000] = "Ultimate";
})(Salaries || (Salaries = {}));
var DepartmentDomainArea;
(function (DepartmentDomainArea) {
    DepartmentDomainArea["SubscriberDepartment"] = "Subscriber department";
    DepartmentDomainArea["TechnicalSupport"] = "Technical support";
    DepartmentDomainArea["MaterialsDepartment"] = "Materials department";
    DepartmentDomainArea["ServerRoom"] = "Server room";
    DepartmentDomainArea["Bookkeeping"] = "Financial transactions";
})(DepartmentDomainArea || (DepartmentDomainArea = {}));
function ExternalPayment(paymentInformation, money) {
    return true;
}
var Compamy = /** @class */ (function () {
    function Compamy() {
        this._name = 'Company name';
        this._bookkeeping = new Bookkeeping(this, 'Bookkeeping', DepartmentDomainArea.Bookkeeping, 100000); // в компании есть бухгалтер
        this._listOfDepartments = [];
        this._listOfPreEmployee = [];
        this._listOfAllDepartmentEmployee = [];
        this.addDepartments(this._bookkeeping);
    }
    // пересчёт сотрудников всех департаментов
    Compamy.prototype.recountOfAllDepartmentEmployee = function () {
        this._listOfAllDepartmentEmployee = this._listOfDepartments.flatMap(function (value) { return value._listOfEmployee; });
    };
    // добавление департамента в компанию и взятие на баланс бухгалтером
    Compamy.prototype.addDepartments = function (department) {
        this._bookkeeping.takeToBalanceDepartment(department);
        this.recountOfAllDepartmentEmployee();
    };
    Compamy.prototype.removeDepartments = function (department) {
        this._bookkeeping.removeToBalanceDepartment(department);
        this.recountOfAllDepartmentEmployee();
    };
    return Compamy;
}());
var Department = /** @class */ (function () {
    function Department(name, domainArea, budgetDebet) {
        this._listOfEmployee = [];
        this._budget = {
            credit: 0,
            debit: 0
        };
        this._name = name;
        this._domainArea = domainArea;
        this._budget.debit = budgetDebet;
    }
    Department.prototype.getName = function () {
        return this._name;
    };
    Department.prototype.getCurrentBalance = function () {
        return this._budget;
    };
    // перевод стажера в работники и взятие на баланс департамента
    Department.prototype.changeOfSalaryFund = function (employee, addRemove) {
        if (addRemove === 'add') {
            var newBudgetDebit = employee._salary + this._budget.debit;
            if (newBudgetDebit > this._budget.debit) {
                this._budget.credit = newBudgetDebit - this._budget.debit;
                this._budget.debit = newBudgetDebit;
            }
            else {
                this._budget.debit = newBudgetDebit;
            }
        }
        else {
            if (this._budget.credit > 0) {
                if (this._budget.credit >= employee._salary) {
                    this._budget.credit -= employee._salary;
                }
                else {
                    this._budget.debit -= (employee._salary - this._budget.credit);
                    this._budget.credit = 0;
                }
            }
        }
    };
    Department.prototype.addEmployee = function (preEmployee, salary) {
        var newEmployee = new Employee(preEmployee, this, salary);
        this._listOfEmployee.push(newEmployee);
        this.changeOfSalaryFund(newEmployee, 'add');
    };
    Department.prototype.removeEmployee = function (employee) {
        var position = this._listOfEmployee.findIndex(function (value) { return value.getNameSurname() === employee.getNameSurname(); });
        if (position >= 0) {
            this._listOfEmployee.splice(position, 1);
            this.changeOfSalaryFund(employee, 'remove');
            return true;
        }
        else {
            return false;
        }
    };
    return Department;
}());
var PreEmployee = /** @class */ (function () {
    function PreEmployee(name, surname, salary, paymentInformation) {
        this._name = name;
        this._surname = surname;
        this._salary = salary;
        this._paymentInformation = paymentInformation;
    }
    PreEmployee.prototype.getNameSurname = function () {
        return "".concat(this._name, " ").concat(this._surname);
    };
    return PreEmployee;
}());
var Employee = /** @class */ (function () {
    function Employee(preEmployee, department, newSalary) {
        this._money = 0;
        this._status = 'Active';
        this._name = preEmployee._name;
        this._surname = preEmployee._surname;
        this._salary = newSalary ? newSalary : preEmployee._salary;
        this._paymentInformation = preEmployee._paymentInformation;
        this._department = department;
    }
    Employee.prototype.getNameSurname = function () {
        return "".concat(this._name, " ").concat(this._surname);
    };
    Employee.prototype.setSalary = function (salary) {
        this._salary = salary;
    };
    Employee.prototype.setPaymentInformation = function (paymentInformation) {
        this._paymentInformation = paymentInformation;
    };
    Employee.prototype.setStatus = function (status) {
        this._status = status;
    };
    // получение зарплаты
    Employee.prototype.receivingASalary = function () {
        this._money += this._salary;
        return true;
    };
    return Employee;
}());
var Bookkeeping = /** @class */ (function (_super) {
    __extends(Bookkeeping, _super);
    function Bookkeeping(company, name, domainArea, cash) {
        var _this = _super.call(this, name, domainArea, cash) || this;
        _this._globalBudget = {
            credit: 0,
            debit: 10000000
        };
        _this._listOfDepartments = [];
        _this._company = company;
        return _this;
    }
    // добавление стажеров на общий баланс
    Bookkeeping.prototype.changeOfSalaryGlobalFund = function (employee, addRemove) {
        if (addRemove === 'add') {
            var newBudgetDebit = employee._salary + this._globalBudget.debit;
            if (newBudgetDebit > this._globalBudget.debit) {
                this._globalBudget.credit = newBudgetDebit - this._globalBudget.debit;
                this._globalBudget.debit = newBudgetDebit;
            }
            else {
                this._globalBudget.debit = newBudgetDebit;
            }
        }
        else {
            if (this._globalBudget.credit > 0) {
                if (this._globalBudget.credit >= employee._salary) {
                    this._globalBudget.credit -= employee._salary;
                }
                else {
                    this._globalBudget.debit -= (employee._salary - this._globalBudget.credit);
                    this._globalBudget.credit = 0;
                }
            }
        }
    };
    Bookkeeping.prototype.takeToBalancePreEmployee = function (preEmployee) {
        this._company._listOfPreEmployee.push(preEmployee);
        this.changeOfSalaryGlobalFund(preEmployee, 'add');
    };
    Bookkeeping.prototype.removeFromBalancePreEmployee = function (preEmployee) {
        var position = this._company._listOfPreEmployee.findIndex(function (value) { return value.getNameSurname() === preEmployee.getNameSurname(); });
        if (position >= 0) {
            this._company._listOfPreEmployee.splice(position, 1);
            this.changeOfSalaryGlobalFund(preEmployee, 'remove');
            return true;
        }
        else {
            return false;
        }
    };
    // добавление на баланс департамента
    Bookkeeping.prototype.changeOfBalanceDepartment = function (department, takeRemove) {
        if (takeRemove === 'take') {
            this._listOfDepartments.push(department);
            this._globalBudget.credit += department._budget.credit;
            this._globalBudget.debit += department._budget.debit;
            return true;
        }
        else {
            var position = this._listOfDepartments.findIndex(function (value) { return value.getName() === department.getName(); });
            if (position >= 0) {
                this._listOfDepartments.splice(position, 1);
                this._globalBudget.credit -= department._budget.credit;
                this._globalBudget.debit -= department._budget.debit;
                return true;
            }
            else {
                return false;
            }
        }
    };
    Bookkeeping.prototype.takeToBalanceDepartment = function (department) {
        this._company._listOfDepartments.push(department);
        this.changeOfBalanceDepartment(department, 'take');
    };
    Bookkeeping.prototype.removeToBalanceDepartment = function (department) {
        this.changeOfBalanceDepartment(department, 'remove');
        var position = this._company._listOfDepartments.findIndex(function (value) { return value.getName() === department.getName(); });
        if (position >= 0) {
            this._company._listOfDepartments.splice(position, 1);
            return true;
        }
        else {
            return false;
        }
    };
    // поиск и выплата зарплат сотрудникам и стажерам(через внешний сервис, в данном случае функцию)
    Bookkeeping.prototype.findEmployee = function (department, anyEmployee) {
        if (anyEmployee instanceof Employee) {
            var currentDepartment = this._listOfDepartments.find(function (value) { return value.getName() === department.getName(); });
            var currentEmployee = currentDepartment === null || currentDepartment === void 0 ? void 0 : currentDepartment._listOfEmployee.find(function (value) { return value.getNameSurname() === anyEmployee.getNameSurname(); });
            return currentEmployee;
        }
        else {
            var currentEmployee = this._company._listOfPreEmployee.find(function (value) { return value.getNameSurname() === anyEmployee.getNameSurname(); });
            return currentEmployee;
        }
    };
    Bookkeeping.prototype.salaryPayment = function (department, employee) {
        var pay = this.findEmployee(department, employee);
        if (pay instanceof Employee) {
            return pay.receivingASalary();
        }
        else if (pay instanceof PreEmployee) {
            return ExternalPayment(pay._paymentInformation, pay._salary);
        }
        else {
            return false;
        }
    };
    return Bookkeeping;
}(Department));
