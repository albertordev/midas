import { useTranslations } from 'next-intl'

const HomePage = () => {
  const t = useTranslations('Homepage')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('content')}</p>
    </div>
  )
}

export default HomePage
