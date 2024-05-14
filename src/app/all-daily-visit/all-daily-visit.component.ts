import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllDailyVisitModel } from './all-daily-visit.component.model';
import { BranchModel } from '../branch/branch.component.model';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-daily-visit',
  templateUrl: './all-daily-visit.component.html',
  styleUrls: ['./all-daily-visit.component.css']
})
export class AllDailyVisitComponent {
  SearchText: any;
  page = 1;
  pageSize = 10;
  dataarray: AllDailyVisitModel[] = [];
  currentPage: number = 1;
  collectionSize = 100;
  dailyvisitssearch !: FormGroup;
  // visitList:AllDailyVisitModel[] = [];
  originalvisitList : AllDailyVisitModel[] = [] ;
  // branches:BranchModel[]=[];

  visitList: any[] = [];
  branches: any[] = []; // Assuming you have this data available
  // pageSize: number = 10; // Assuming you have pagination setup


  permissions: any;
  Perstring:any;
  insertvisit!:boolean;
  deletevisit!:boolean;
  updatevisit!:boolean;
  view!:boolean;
  viewRM!:boolean;
  viewbranch!:boolean;
  viewall!:boolean;

  constructor(private formBuilder: FormBuilder, private service:ApiService,private router:Router) {
    this.dailyvisitssearch = this.formBuilder.group({
      branch: ['', Validators.required], // Add validation if needed
    
    });
}
  ngOnInit(){
    this.Perstring = localStorage.getItem('permissions');
    if (this.Perstring) {
      this.permissions = JSON.parse(this.Perstring);
      this.permissions.forEach((permission: number) => {
        if (permission === 1007){this.insertvisit = true};
        if (permission === 1008){this.deletevisit = true};
        if (permission === 1009){this.updatevisit = true};
        if (permission === 1010){this.view = true};
        if (permission === 1011){this.viewRM = true};
        if (permission === 1012){this.viewbranch = true};
        if (permission === 1013){this.viewall = true};
      });
    } else {
      console.log('No permissions data found.');
    };


    this.dailyvisitssearch = new FormGroup({
      branch: new FormControl('')
    });

    this.service.alldailyVisits().subscribe(
      ( data: any) => {
        this.originalvisitList=data.data;
        this.visitList = this.originalvisitList ;
        console.log('Response successful!',data.data);
        this.collectionSize= data.data.length ;
      },
      (error:any) => {
        console.error('API Error:', error);
      }
    );


    this.service.allBranches().subscribe(
      (responce:any)=>{
        this.branches=responce.data;
      },
      (error:any)=>{
        console.error(error);        
      }
    )
  }

  edit(id:any){
    this.router.navigate(['/set/view-add-dailyvisits/'+id]);
  }

  applyFilter(): void {
    const searchString = this.SearchText.toLowerCase();
    // const filteredData = [...this.visitList];
    this.visitList = this.originalvisitList.filter((data) =>
      data.company_name.toLowerCase().includes(searchString) ||
      data.cust_name.toLowerCase().includes(searchString) ||
      data.branch.toLowerCase().includes(searchString) ||
      data.attendedByFN.toLowerCase().includes(searchString)
    );
  }
  refreshCountries() {
    // this.countries = this.dataarray
    //   .map((country, i) => ({id: i + 1, ...country}))
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  
  onSubmit(){
    console.log("DATA :::::: " ,this.dailyvisitssearch.value);
    
    this.service.SearchVisitdetails(this.dailyvisitssearch.value).subscribe(
      (responce:any)=>{
        this.visitList=responce.data;
        console.log('val',responce.data);
      },
      (error:any)=>{
        console.error(error);        
      }
    )
  }


  AllTempCustByBranch(): void {
    // Retrieve form values
    const formData = this.dailyvisitssearch.value;

    // Call API with form data
    this.service.allTempCustByBranch(formData).subscribe(
      (response: any) => {
        console.log('Filtered data:', response.data);
        // Update visitList with the filtered data
        this.visitList = response.data;
      },
      (error: any) => {
        console.error('Error fetching filtered data:', error);
      }
    );
  }

}
