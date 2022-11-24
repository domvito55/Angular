import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "./product.model";
import { RestDataSource } from "./rest.datasource";
import { ResponseModel } from "./response.model";


@Injectable()
export class ProductRepository {
    //properties
    private products: Product[] = [];
    private categories: string[] = [];
    listReady: boolean = false;

    //constructor
    constructor(private dataSource: RestDataSource) {
        dataSource.getProducts().subscribe(data => {
            this.products = data;
            this.categories = data.map(p => p.category)
                .filter((c, index, array) => array.indexOf(c) == index).sort();
        });
    }

    //Methods
    //_CRUD
    //__Read methods
    getProducts(category: string = null): Product[] {
        // console.log(this.products
        //     .filter(p => category == null || category == p.category)
        //     .sort((a, b) =>{return (a.title > b.title)? 1 : -1;}));
        return this.products
            .filter(p => category == null || category == p.category)
            .sort((a, b) =>{return (a.title > b.title)? 1 : -1;});
    }
    getProduct(id: string): Product {
        return this.products.find(p => p._id == id);
    }

    setProduct(){
        this.listReady = false;
        this.dataSource.getProducts().subscribe(data => {
            this.products = data;
            this.listReady = true;
        });
    }

    getCategories(): string[] {
        return this.categories;
    }
    //__Create and update method
    async saveProduct(product: Product) {
        //Create
        if (product._id == null || product._id == "") {
            this.dataSource.saveProduct(product)
                .subscribe(response => this.products.push(response));
                if(!this.categories.includes(product.category)){
                    this.categories.push(product.category);
                }
        //Update
        } else {
            this.dataSource.updateProduct(product)
                .subscribe(response => {
                    this.products.splice(this.products.
                        findIndex(response => response._id == product._id), 1, product);
                });
        }
    }
    //Delete
    deleteProduct(id: string) {
        this.dataSource.deleteProduct(id).subscribe(p => {
            this.products.splice(this.products.
                findIndex(p => p._id == id), 1);
            this.categories = this.products.map(p => p.category)
                .filter((c, index, array) => array.indexOf(c) == index).sort();
        })
    }
    
}