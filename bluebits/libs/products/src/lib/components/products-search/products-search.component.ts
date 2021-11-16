import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'products-search',
  templateUrl: './products-search.component.html',
  styles: [
  ]
})
export class ProductsSearchComponent implements OnInit {

    // used to enable the category checkbox section in the parent product list component
  // @Output() enableCategoryCheckboxes = new EventEmitter<boolean>();

  searchCriteria: string;
  missingSearchText;
  
  constructor(private router: Router) { }

  ngOnInit() {
      this.missingSearchText = false;
      this.searchCriteria = '';
  }

  submitSearch() {
    if (this.searchCriteria != '') {
        this.router.navigate(['/products'], { queryParams: { searchText: this.searchCriteria } });
        this.searchCriteria = "";
        this.missingSearchText = false;
        // this.enableCategoryCheckboxes.emit(true);
     } else {
        this.missingSearchText = true;
        console.log(this.missingSearchText);
     }
    
  }
}
