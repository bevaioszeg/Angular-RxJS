import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product: Product;

  sub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.sub = new Subscription();
    this.sub.add(
      this.productService.selectedProduct().subscribe(
        product => this.product = product,
        error => this.errorMessage = error
      )
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
