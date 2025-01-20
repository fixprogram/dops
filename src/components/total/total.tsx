import { FC } from 'react'
import styles from './total.module.css'
import { convertCentsToEuros } from '../../utils/convertCentsToEuros'
import { Keys, useTotal } from '../../hooks/useTotal'

const titles: Record<Keys, string> = {
  deliveryFee: 'Delivery',
  smallOrderSurcharge: 'Small order surcharge',
  cart: 'Cart value'
}

export const Total: FC = () => {
  const { formattedData, total, distance, deliveryError } = useTotal()

  return (
    <section className={styles.Total}>
      <span className={styles.Title}>
        Prices in EUR
        {!deliveryError ? (
          <span className={styles.Subtitle}>Fill details form to see total</span>
        ) : null}
      </span>

      {!deliveryError ? (
        <dl className={styles.Items}>
          {formattedData.map(({ key, value }) => (
            <div key={key} className={styles.Item}>
              <dt className={styles.ItemTitle}>
                {titles[key]}
                {key === 'deliveryFee' ? (
                  <span data-raw-value={distance}>{` (${distance} m)`}</span>
                ) : null}
              </dt>
              <dd className={styles.ItemValue} data-raw-value={value}>
                {convertCentsToEuros(value)}
              </dd>
            </div>
          ))}

          {total ? (
            <div key={'total'} className={styles.Item}>
              <dt className={styles.ItemTitle} style={{ fontWeight: 700 }}>
                Total
              </dt>
              <dd className={styles.ItemValue} style={{ fontWeight: 700 }} data-raw-value={total}>
                {convertCentsToEuros(total)}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {deliveryError && (
        <div>
          <p className={styles.Error}>
            <svg viewBox="0 0 24 24" className={styles.ErrorIcon}>
              <path d="M11.984.003a12.205 12.205 0 00-8.51 3.652A11.799 11.799 0 00.002 12.21 11.778 11.778 0 0011.8 24h.214c6.677-.069 12.039-5.53 11.985-12.208A11.765 11.765 0 0011.984.003zM10.5 16.543a1.476 1.476 0 011.449-1.53h.027c.82.002 1.492.65 1.522 1.47a1.475 1.475 0 01-1.448 1.53h-.027a1.529 1.529 0 01-1.523-1.47zm.5-4.041v-6a1 1 0 012 0v6a1 1 0 01-2 0z"></path>
            </svg>{' '}
            {deliveryError}
          </p>
        </div>
      )}
    </section>
  )
}
