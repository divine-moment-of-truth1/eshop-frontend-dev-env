import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    apiURLProducts = environment.apiUrl + 'products';

    constructor(private http: HttpClient) { }

    getProducts(sortBy: any, categoriesFilter?: string[]): Observable<Product[]> {
          let params = new HttpParams();

        if (categoriesFilter) {
            params = params.append('categories', categoriesFilter.join(','))
        }

        if (sortBy) {
            params = params.append('sort', sortBy.value)
        }

        //console.log(sortBy);
        
        return this.http.get<Product[]>(this.apiURLProducts, {params : params} );
    }

    getProductsBySearchCriteria(sortBy: any, searchCriteria?: string): Observable<Product[]> {
        console.log(sortBy.value);
        let params = new HttpParams();

        if (searchCriteria) {
            params = params.append('searchText', searchCriteria);
        }

        if (sortBy) {
            params = params.append('sort', sortBy.value)
        }
        
        // console.log(params);

        return this.http.get<Product[]>(this.apiURLProducts, { params: params } );
    }

    getProductsNEW(sortBy: any, searchCriteria: string, categoriesFilter?: string[]): Observable<Product[]> {
        let params = new HttpParams();

      if (categoriesFilter) {
          params = params.append('categories', categoriesFilter.join(','))
          console.log("Entered - categoriesFilter")
      }

      if (searchCriteria) {
        params = params.append('searchText', searchCriteria);
        console.log("Entered - searchCriteria")
      }

      if (sortBy) {
          params = params.append('sort', sortBy.value)
          console.log("Entered - sortBy")
      }

      //console.log(sortBy);
      
      return this.http.get<Product[]>(this.apiURLProducts, {params : params} );
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
    }

    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, productData)
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
    }

    updateProduct(productData: FormData, productId: string): Observable<Product> {
         return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, productData)
    }

    getProductsCount(): Observable<number> {
        return this.http
            .get<number>(this.apiURLProducts + '/get/count')
            .pipe(map((objectValue: any) => objectValue.productCount));
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
    }
}
