import { Component, OnInit, OnDestroy } from '@angular/core';

import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  selectedCategorySubject: Subject<number>;

  products: Product[] = [];
  sub: Subscription;

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
    this.sub = new Subscription();
    this.selectedCategorySubject = new BehaviorSubject<number>(0);
    this.sub.add(
      combineLatest([
        this.productService.getProductsWithCategory(),
        this.selectedCategorySubject.asObservable()
      ])
      .pipe(
        map(([products, categoryId]) => 
          products.filter(product =>
            categoryId ? product.categoryId === categoryId : true)
        )
      )
        .subscribe(
          products => this.products = products,
          error => this.errorMessage = error
        )
    );
    this.sub.add(
      this.productCategoryService.getProductCategories()
        .subscribe(
          categories => this.categories = categories,
          error => this.errorMessage = error
        )
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategorySubject.next(+categoryId);
  }
}
