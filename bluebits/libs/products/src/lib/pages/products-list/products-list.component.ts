import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

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
    this.isCategoryPage = false;

    this.activatedRoute.queryParams.subscribe((params) => {
        // If navigated to this page by clicking one of the category buttons on the home page
        if (params.categoryid) {
            console.log("HELLO!!!")
            this.categoryIdParam = [(params.categoryid).toString()];
            this._getProducts(this.categoryIdParam);
            this._getCategories(this.categoryIdParam);
            // this.setCategoryCheckBox(params);
            this.isCategoryPage = false;
        } else if (params.searchText) {
            this.searchTextParam = params.searchText;
            this._getProducts();
            // this._getProductsBySearchCriteria();
            this._getCategories();
            this.isCategoryPage = false;
        } else {
            this._getProducts();
            this._getCategories();
         }
    })
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

//   private _getProducts(categoriesFilter?: string[]) {
//     this.productsService.getProducts(this.selectedSortOption, categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(product => {
//         this.products = product;
//     })
//   }

//   private _getProductsBySearchCriteria() {
//     this.productsService.getProductsBySearchCriteria(this.selectedSortOption, this.searchTextParam).pipe(takeUntil(this.endSubs$)).subscribe(product => {
//         this.products = product;
//     })
//   }

  private _getProducts(categoriesFilter?: string[]) {
    this.productsService.getProductsNEW(this.selectedSortOption, this.searchTextParam, categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(product => {
        this.products = product;
    })
  }

  private _getCategories(setCategory?: any) {
    this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe(category => {
        this.categories = category;
        if (setCategory) {
            this.setCategoryCheckBox(setCategory);
        }
    })
  }

  categoryFilter() {
    const selectedCategories = this.categories
        .filter(category => category.checked)
        .map(cat => cat.id);

    this._getProducts(selectedCategories);   
  }

  setCategoryCheckBox(categoryId: string) {
    const categoryid = categoryId.toString()

    for(let i = 0; i < this.categories.length; i++) {
        console.log(this.categories[i])
        if (this.categories[i].id === categoryid) {
            console.log(this.categories[i].name)
            this.categories[i].checked = true;
        }
    }
  }

  onSortSelected(sort: any) {
    this.selectedSortOption = sort;
    this.categoryFilter();
  }

}
