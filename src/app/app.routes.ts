import { Routes } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { CreateCategoryComponent } from './admin/ui/category/create-category/create-category.component';
import { CreateProductComponent } from './admin/ui/product/create-product/create-product.component';
import { AdminProductsComponent } from './admin/ui/product/admin-products/admin-products.component';
import { AdminCategoriesComponent } from './admin/ui/category/admin-categories/admin-categories.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { ProductsComponent } from './shop/products/products.component';
import { CartComponent } from './shop/cart/cart.component';
import { CartSummary } from './shop/cart-summary/cart-summary.component';
import { OrdersComponent } from './shop/orders/orders.component';
import { OrderDetailsComponent } from './shop/order-details/order-details.component';
import { PaymentComponent } from './shop/payment/payment.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'auth/sign-up',
        component: SignUpComponent
    },
    {
        path: 'auth/sign-in',
        component: SignInComponent
    },
    {
        path: 'auth/forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'auth/reset-password',
        component: ResetPasswordComponent,
    },
    {
        path: 'auth/verify-email',
        component: EmailVerificationComponent,
    },
    {
        path: 'admin/categories/list',
        component: AdminCategoriesComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'admin/categories/create',
        component: CreateCategoryComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'admin/products/create',
        component: CreateProductComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'admin/products/list',
        component: AdminProductsComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'product/:productId',
        component: ProductDetailsComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'order-summary',
        component: CartSummary,
        canActivate: [AuthGuard],
    },
    {
        path: "orders",
        component: OrdersComponent,
        canActivate: [AuthGuard],
    },
    {
        path: "orders/:orderId",
        component: OrderDetailsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'orders/:orderId/make-payment',
        component: PaymentComponent,
        canActivate: [AuthGuard],
    }
];
