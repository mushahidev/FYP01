'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Certifique-se de ter o axios instalado

import { Settings } from '../../../../payload/payload-types';
import { Button } from '../../../_components/Button';
import { PaymentGateway } from '../../../_components/PaymentGateway';
import { LoadingShimmer } from '../../../_components/LoadingShimmer';
import { useAuth } from '../../../_providers/Auth';
import { useCart } from '../../../_providers/Cart';
import { useTheme } from '../../../_providers/Theme';
import cssVariables from '../../../cssVariables';
import { CheckoutForm } from '../CheckoutForm';
import { CheckoutItem } from '../CheckoutItem';
import {CancelShipmentComponent } from '../../../_components/FreightCancel';
import { FreightCalculator} from '../../../_components/FreightSend';
import classes from './index.module.scss';



export const CheckoutPage = ({ settings }) => {
  const { productsPage } = settings;
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [freightPrice, setFreightPrice] = useState(0);
  const { cart, cartIsEmpty, cartTotal } = useCart();
  const { theme } = useTheme();

  useEffect(() => {
    if (user === null || cartIsEmpty) {
      router.push(cartIsEmpty ? '/cart' : '/login');
    }
  }, [user, cartIsEmpty, router]);

  // Corrigindo a lógica de cálculo do total
  const totalWithFreight = cartTotal.raw + freightPrice;

  if (!user) return null;

  return (
    <Fragment>
      {!cartIsEmpty ? (
        <div className={classes.items}>
          <div className={classes.header}>
            <p>Produtos</p>
            <div className={classes.headerItemDetails}>
              <p className={classes.quantity}>Quantidade</p>
              <p className={classes.subtotal}>Subtotal</p>
            </div>
          </div>
          <ul>
            {cart.items.map((item, index) => (
              <CheckoutItem key={index} product={item.product} title={item.product.title}  quantity={item.quantity} index={index} />
            ))}
            <FreightCalculator onFreightPriceSet={setFreightPrice} />
            <div className={classes.orderTotal}>
              <p>Total do pedido</p>
              <p>R$ {totalWithFreight.toFixed(2)}</p>
            </div>
          </ul>
        </div>
      ) : (
        <div>
          <p>Seu carrinho está vazio.</p>
          <Link href="/cart">Voltar ao carrinho</Link>
        </div>
      )}

      {(
        <Fragment>
          <h3 className={classes.payment}>Detalhes do pagamento</h3>
          {error && <p>{`Error: ${error}`}</p>}
          <PaymentGateway amount={totalWithFreight} />
        </Fragment>
      )}
    </Fragment>
  );
};
