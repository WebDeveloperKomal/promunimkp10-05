import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewCustomerModel } from './new-customers.component.model';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';
import { ProductsModel } from '../products/products.component.model';

@Component({
  selector: 'app-new-customers',
  templateUrl: './new-customers.component.html',
  styleUrls: ['./new-customers.component.css']
})
export class NewCustomersComponent {
  SearchText : any ;

  page = 1;
  pageSize = 10 ;
  dataarray: NewCustomerModel[] = [];
  currentPage: number = 1;
  countries: NewCustomerModel[] | undefined;
  collectionSize =100;
  employeeForm !: FormGroup;
  custForm1 !: FormGroup;
  products:ProductsModel[]=[];
  // temCustomerList:NewCustomerModel[]=[];
  originalCustomerList : NewCustomerModel[] = [] ;
  selecteddata : any ;

  branches: any[] = [];
  EmployeesList: any[] = [];
  insertTime: any[] = []; // Assuming you have this data available
  updateTime: any[] = []; // Assuming you have this data available
  temCustomerList: any[] = [];

  filteredCustomerList: any[] = [];

  permissions: any;
  Perstring:any;
  insertTempCust!:boolean;
  deleteTempCust!:boolean;
  updateTempCust!:boolean;
  view!:boolean;
  viewRM!:boolean;
  viewbranch!:boolean;
  viewall!:boolean;

  constructor(private formBuilder: FormBuilder, private apiService:ApiService) {
    this.employeeForm = this.formBuilder.group({
      branchId: ['', Validators.required], // Add validation if needed
      fromdate: ['', Validators.required], // Add validation if needed
      todate: ['', Validators.required], // Add validation if needed
      insertTime: ['', Validators.required],
      updateTime : ['', Validators.required]
    });

    this.custForm1 = this.formBuilder.group({
      customerId:  ['', Validators.required], // Add validation if needed
      companyName: ['', Validators.required], // Add validation if needed
      customerFullName: ['', Validators.required], // Add validation if needed
      emailId: ['', Validators.required], // Add validation if needed
      contactNo: ['', Validators.required],
      altContactNo: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      pinCode: ['', Validators.required],
      constitutionOfCompany: ['', Validators.required],
      segment: ['', Validators.required],
      natureOfBussiness: ['', Validators.required],
      maintainingITR: ['', Validators.required],
      leadType: ['', Validators.required],
      leadStatus: ['', Validators.required],
      productId: ['', Validators.required],
    });
  }

  ngOnInit(){
    this.Perstring = localStorage.getItem('permissions');
    if (this.Perstring) {
      this.permissions = JSON.parse(this.Perstring);
      this.permissions.forEach((permission: number) => {
        if (permission === 1000){this.insertTempCust = true};
        if (permission === 1001){this.deleteTempCust = true};
        if (permission === 1002){this.updateTempCust = true};
        if (permission === 1003){this.view = true};
        if (permission === 1004){this.viewRM = true};
        if (permission === 1005){this.viewbranch = true};
        if (permission === 1006){this.viewall = true};
      });
    } else {
      console.log('No permissions data found in local storage.');
    };

    this.apiService.allTempCustomers().subscribe(
      (responce:any)=>{
        this.originalCustomerList=responce.data;
        this.temCustomerList = this.originalCustomerList ;
        this.collectionSize = responce.data.length;
        console.log('val', responce.data);
        console.log('set',responce.data[0].tempCustFullName )
      },
      (error:any)=>{
        console.error(error);        
      }
    );
    this.apiService.allProducts().subscribe(
      (res:any)=>{this.products = res.data},
      (err:any)=>{console.error(err);}
    )

    this.apiService.allBranches().subscribe(
      (responce:any)=>{
        this.branches=responce.data;
      },
      (error:any)=>{
        console.error(error);        
      }
    )

    this.employeeForm =this.formBuilder.group({
      branchId: [''],
      insertTime: [''],
      updateTime: [''],
      companyName: [''],
    });
  }

  AllNewCustByBranch(){
      const formData = this.employeeForm.value;
      this.apiService.allNewCustByBranch(formData).subscribe(
        (response: any) => {
          console.log('Filtered data:', response.data);
          this.temCustomerList  = response.data;
        },
        (error: any) => {
          console.error('Error fetching filtered data:', error);
        }
      );
  }
 

  // AllNewCustByBranch(): void {
  //   // Retrieve form values
  //   const formData = this.employeeForm.value;

  //   // Check if any form control has value
  //   const hasValue = Object.values(formData).some(val => val !== null && val !== '');

  //   if (hasValue) {
  //     // Call API with form data
  //     this.apiService.allNewCustByBranch(formData).subscribe(
  //       (response: any) => {
  //         console.log('Filtered data:', response.data);
  //         // Update temCustomerList with the filtered data
  //         this.temCustomerList = response.data;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching filtered data:', error);
  //       }
  //     );
  //   } else {
  //     // If no form control has value, fetch all data
  //     this.apiService.allTempCustomers().subscribe(
  //       (response: any) => {
  //         console.log('All data:', response.data);
  //         // Update temCustomerList with all data
  //         this.temCustomerList = response.data;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching all data:', error);
  //       }
  //     );
  //   }
  // }

  
  // AllNewCustByBranch(): void {
  //   Retrieve form values
  //   const formData = this.employeeForm.value;
  
  //   Check if any form control has value
  //   const hasValue = Object.values(formData).some(val => val !== null && val !== '');
  
  //   if (hasValue) {
  //     Call API with form data
  //     this.apiService.allNewCustByBranch(formData).subscribe(
  //       (response: any) => {
  //         console.log('Filtered data:', response.data);
  //         Map the fields from the filter API response to the fields in the get API response
  //         const mappedData = response.data.map((item: any) => ({
  //           customerFullName: item.tempCustFullName,
  //           leadStatus: item.tempCustLeadStatus,
  //           tempCustBranchId: item.tempCustBranchId,
  //           address: item.tempCustAddesss,
  //           productId: item.tempCustProductId,
  //           city: item.tempCustcity,
  //           companyName: item.tempCustCompanyName,
  //           tempCustCreationDate: item.tempCustCreationDate,
  //           emailId: item.tempCustEmailId,
  //           natureOfBussiness: item.tempCustBussiNature,
  //           productName: item.tempCustProduct,
  //           maintainingITR: item.tempCustMaintITR,
  //           attendedByLN: item.attendedByLN,
  //           leadType: item.tempCustLeadType,
  //           pinCode: item.tempCustPinCode,
  //           segment: item.tempCustSegment,
  //           customerId: item.tempCustId,
  //           constitutionOfCompany: item.tempCustConstitution,
  //           attendedByFN: item.attendedByFN,
  //           altContactNo: item.tempCustAltContactNo,
  //           contactNo: item.tempCustContactNo,
  //           tempCustBranchName: item.tempCustBranchName
  //         }));
          
  //         Update temCustomerList with the mapped data
  //         this.temCustomerList = mappedData;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching filtered data:', error);
  //       }
  //     );
  //   } else {
  //     If no form control has value, fetch all data
  //     this.apiService.allTempCustomers().subscribe(
  //       (response: any) => {
  //         console.log('All data:', response.data); 
  //         Log all data to console
  //         Update temCustomerList with all data
  //         this.temCustomerList = response.data;
  //       },
  //       (error: any) => {
  //         console.error('Error fetching all data:', error);
  //       }
  //     );
  //   }
  // }
  

  update(){
    console.log(this.custForm1.value);
    this.apiService.UpdateTempCustomer(this.custForm1.value).subscribe(
      (res:any)=>{
        console.log(res);
        Swal.fire({
          title: "Record Updated!",
          icon: "success"
        });
      },
      (err:any)=>{
        console.error(err);
        Swal.fire({
          title: "Error!",
          icon: "error"
        });
      }
    );
    // setInterval(()=>{window.location.reload()},1000);
   }


  delete(id:number){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
      }).then((result) => {
      if (result.isConfirmed) 
      {
        this.apiService.deleteTempCustomer(id).subscribe(
          (response:any)=>{
            console.log(response.data); 
            Swal.fire({
              title: "Record Deleted!!!!",
              icon: "success"
            });
          },
          (error:any)=>{
            console.error(error);
            Swal.fire({
              title: "Error!",
              icon: "error"
            });
          }
        );
        //setInterval(()=>{window.location.reload()},1000);  
      }
    });
    
  }




ShowDetails(data : any){
  this.selecteddata = data;
   this.loadEmployeeData();
}
  applyFilter(): void {
    const searchString = this.SearchText.toLowerCase();
    // const filteredData = [...this.temCustomerList];
    this.temCustomerList = this.originalCustomerList.filter((data) =>
      (data.tempCustCompanyName?.toLowerCase() ?? '').includes(searchString) ||
      (data.tempCustFullName?.toLowerCase() ?? '').includes(searchString) ||
      (data.tempCustContactNo?.toLowerCase() ?? '').includes(searchString) ||
      (data.attendedByFN?.toLowerCase() ?? '').includes(searchString) ||
      (data.attendedByLN?.toLowerCase() ?? '').includes(searchString) ||
      (data.tempCustCreationDate?.toLowerCase() ?? '').includes(searchString) ||
      (data.tempCustBranchName?.toLowerCase() ?? '').includes(searchString)
    );

  // tempCustId : any;
  // tempCustCompanyName: any;
  // tempCustFullName: any;
  // tempCustEmailId: any;
  // tempCustContactNo: any;
  // tempCustAltContactNo: any;
  // tempCustAddesss: any;
  // tempCustcity: any;
  // tempCustPinCode: any;
  // tempCustProductId: any;
  // tempCustProduct: any;
  // tempCustConstitution: any;
  // tempCustSegment: any;
  // tempCustBussiNature: any;
  // tempCustMaintITR: any;
  // tempCustLeadType: any;
  // tempCustLeadStatus: any;
  // tempCustCreationDate: any;
  // tempCustBranchId: any;
  // tempCustBranchName: any;
  // attendedByFN: any;
  // attendedByLN: any;
}
refreshCountries() {
  this.countries = this.temCustomerList
    .map((country, i) => ({id: i + 1, ...country}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
}


loadEmployeeData() {
  // Assuming tempCustId is the unique identifier for each employee
  const selectedEmployeeId = this.selecteddata.tempCustId;

  // Find the selected employee in the list
  const selectedEmployee = this.temCustomerList.find(
    (employee) => employee.tempCustId === selectedEmployeeId
  );

  if (selectedEmployee) {
    // Patch the form with the selected employee's data
    this.custForm1.patchValue({
      customerId: selectedEmployee.tempCustId,
      companyName: selectedEmployee.tempCustCompanyName,
      customerFullName: selectedEmployee.tempCustFullName,
      emailId: selectedEmployee.tempCustEmailId,
      contactNo:selectedEmployee.tempCustContactNo , 
      altContactNo:selectedEmployee.tempCustAltContactNo ,
      address: selectedEmployee.tempCustAddesss ,
      city:selectedEmployee.tempCustcity ,
      pinCode:selectedEmployee.tempCustPinCode , 
      constitutionOfCompany: selectedEmployee.tempCustConstitution ,
      segment:selectedEmployee.tempCustSegment ,
      natureOfBussiness: selectedEmployee.tempCustBussiNature ,
      maintainingITR: selectedEmployee.tempCustMaintITR ,
      leadType: selectedEmployee.tempCustLeadType ,
      leadstatus:selectedEmployee.tempCustLeadStatus ,
      productId:selectedEmployee.tempCustProduct 

      // ... other form controls
    });
  } else {
    console.error('Selected employee not found in the list');
    // Handle error or provide a default behavior
  }
}


}
