import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  endSubs$: Subject<any> = new Subject();
  isCategoryPage: boolean;  // true if the product-list page is accessed from clicking a category button on the home page
  searchTextParam: string;
  categoryIdParam: string[];
  selectedSortOption;
  sortOptions = [
    { name: "Alphabetical", value: 'name' },
    { name: "Price: Low to High", value: 'priceAsc' },
    { name: "Price: High to Low", value: 'priceDesc' },
    { name: "Highest Rated", value: 'rating' },
  ];

  constructor(private productsService: ProductsService,
    private categoryService: CategoriesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedSortOption = { name: "Alphabetical", value: "name" };
    this.isCategoryPage = true;

    // If navigated to this page by clicking one of the category buttons on the home page
    this.activatedRoute.queryParams.subscribe((params) => {
        if (params.categoryid) {
            this.categoryIdParam = [(params.categoryid).toString()];
            this._getProducts(this.categoryIdParam);
            this.setCategoryCheckBox(params);
            this.isCategoryPage = true;
  
        } else if (params.searchText) {
            this.searchTextParam = params.searchText;
            this._getProductsBySearchCriteria();
            this.isCategoryPage = false;
        } else {
            this._getProducts();
         }
    })
    this._getCategories();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }


  private _getProducts(categoriesFilter?: string[]) {
    //   this.productsService.getProducts(categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(product => {
        this.productsService.getProducts(this.selectedSortOption, categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(product => {
          this.products = product;
    })
  }

  // private _getProductsBySearchCriteria(searchText: string) {
  private _getProductsBySearchCriteria() {
        this.productsService.getProductsBySearchCriteria(this.selectedSortOption, this.searchTextParam).pipe(takeUntil(this.endSubs$)).subscribe(product => {
        // this.productsService.getProductsBySearchCriteria(searchText, this.selectedSortOption).pipe(takeUntil(this.endSubs$)).subscribe(product => {
        this.products = product;
    })
  }

  private _getProductsNEW(categoriesFilter?: string[]) {
      console.log(categoriesFilter)
        this.productsService.getProductsNEW(this.selectedSortOption, this.searchTextParam, categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(product => {
          this.products = product;
    })
  }

  private _getCategories() {
      this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe(category => {
          this.categories = category;
      })
  }

  categoryFilter() {
    const selectedCategories = this.categories
        .filter(category => category.checked)
        .map(cat => cat.id);

        console.log("FROM - categoryFilter" + selectedCategories)

    this._getProductsNEW(selectedCategories);   
  }

  setCategoryCheckBox(cat: any) {
    console.log(cat)
    for(let i = 0; this.categories.length; i++) {
        if (this.categories[i] === cat) {
                // set the checkbox for the category
            break;
        }
    }
  }

  onSortSelected(sort: any) {
      console.log(sort)
    this.selectedSortOption = sort;
    this.categoryFilter();
    // this._getProductsNEW();
  }

}
