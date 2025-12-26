import { CTA, PlayingCards } from '../components';

export default function Home() {
  return (
    <div className='homepage__wrapper'>
      <section className='homepage__hero'>
        <div className='homepage__hero-left'>
          <h1>Lorem ipsum dolor sit amet</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <CTA
            text='Get Started'
            type='anchor'
            href='/signup'
            className='cta-button cta-button--medium cta-button--bold cta-button--purple'
            ariaLabel='Sign up for Agile Story Planning Poker'
          />
        </div>
        <div className='homepage__hero-right'>
          <PlayingCards isHomepage={true} />
        </div>
      </section>
      <section className='homepage__video'>
        <h2 className='h1'>Lorem ipsum dolor sit amet</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <video
          controls
          loop
          preload='none'
          poster='https://dummyimage.com/1024x576/999999/ffffff.jpg'
        >
          <source
            src='https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4'
            type='video/mp4'
          />
        </video>
      </section>
      <section className='homepage__direct-cta'>
        <h2 className='h1'>Lorem ipsum dolor sit amet</h2>
        <CTA
          text='Get Started'
          type='anchor'
          href='/signup'
          className='cta-button cta-button--medium cta-button--bold cta-button--purple'
          ariaLabel='Sign up for Agile Story Planning Poker'
        />
      </section>
    </div>
  );
}
