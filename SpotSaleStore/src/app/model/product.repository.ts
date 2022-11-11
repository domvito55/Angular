import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "./product.model";
import { StaticDataSource } from "./static.datasource";
@Injectable()
export class ProductRepository {
    private products: Product[] = [];
    private categories: string[] = [];
    constructor(private dataSource: StaticDataSource) {
        dataSource.getProducts().subscribe(data => {
            this.products = data;
            this.categories = data.map(p => p.category)
                .filter((c, index, array) => array.indexOf(c) == index).sort();
        });
    }
    getProducts(category: string = null): Product[] {
        return this.products
            .filter(p => category == null || category == p.category);
    }
    getProduct(id: string): Product {
        return this.products.find(p => p._id == id);
    }
    getCategories(): string[] {
        return this.categories;
    }
    // saveProduct(product: Product): Observable<Product> {
    //     return this.dataSource.saveProduct(product);
    // }

    saveProduct(product: Product) {
        if (product._id == null || product._id == "") {
            this.dataSource.saveProduct(product)
                .subscribe(p => this.products.push(p));
                if(!this.categories.includes(product.category)){
                    this.categories.push(product.category);
                }
         } else {
             this.dataSource.updateProduct(product)
                 .subscribe(p => {
                     this.products.splice(this.products.
                         findIndex(p => p._id == product._id), 1, product);
                 });
         }
    }

    deleteProduct(id: string) {
        this.dataSource.deleteProduct(id).subscribe(p => {
            this.products.splice(this.products.
                findIndex(p => p._id == id), 1);
            this.categories = this.products.map(p => p.category)
                .filter((c, index, array) => array.indexOf(c) == index).sort();
        })
    }
}