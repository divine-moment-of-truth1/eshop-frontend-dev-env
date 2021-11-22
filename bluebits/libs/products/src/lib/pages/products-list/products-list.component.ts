import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ShopParams } from '../../models/shopParams';
import { Pagination } from '../../models/pagination';

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
  searchNotFound = false;  // true if the product-list page is accessed from clicking a category button on the home page
  searchTextParam: string;
  categoryIdParam: string[];
  selectedSortOption;
  sortOptions = [
    { name: "Alphabetical", value: 'name' },
    { name: "Price: Low to High", value: 'priceAsc' },
    { name: "Price: High to Low", value: 'priceDesc' },
    { name: "Highest Rated", value: 'rating' },
  ];
  shopParams = new ShopParams();
  totalCount: number;

  constructor(private productsService: ProductsService,
    private categoryService: CategoriesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedSortOption = { name: "Alphabetical", value: "name" };
    this.shopParams.pageSize = 9;
 
    this.activatedRoute.queryParams.subscribe((params) => {
        // If navigated to this page by clicking one of the category buttons on the home page
        if (params.categoryid) {
            this.categoryIdParam = [(params.categoryid).toString()];
            this._getProducts(this.categoryIdParam);
            this._getCategories(this.categoryIdParam);
        } else if (params.searchText) {
            this.searchTextParam = params.searchText;
            this._getProducts();
            this._getCategories();
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

  private _getProducts(categoriesFilter?: string[]) {
    this.productsService
        .getProductsClient(this.selectedSortOption, this.searchTextParam, this.shopParams, categoriesFilter)
        .pipe(takeUntil(this.endSubs$))
        .subscribe((response: any) => {
            console.log("Response from server:- " + response)
            this.products = response.products;
            this.shopParams.pageNumber = response.pageIndex;
            this.shopParams.pageSize = response.pageSize;
            this.totalCount = response.count;
            if( this.products.length === 0) {
                this.searchNotFound = true;
            }
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
    this.shopParams.pageNumber = 0; 
    this.shopParams.pageSize = 9;
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

  onPageChanged(event: any) {
    this.shopParams.pageNumber = event.page;
    this.shopParams.pageSize = event.rows;
    this._getProducts()
    console.log("On page change:- ")
    console.log("First:- " + event.first)
    console.log("Rows:- " + event.rows)
    console.log("Page:- " + event.page)
    console.log("PageCount:- " + event.pageCount)
  }

}
