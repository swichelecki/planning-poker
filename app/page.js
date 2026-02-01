import { CTA, PlayingCards, VideoPlayBtn } from '../components';

export default function Home() {
  return (
    <div className='homepage__wrapper'>
      <section className='homepage__hero'>
        <div className='homepage__hero-left'>
          <h1>Agile Story Planning Poker</h1>
          <p>
            Free planning poker tool for remote scrum team story point
            estimation. Create voting rooms and invite teammates for online
            story point estimation.
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
        <h2 className='h1'>Remote Story Point Estimation</h2>
        <p>
          Join a call on your favorite online meeting app and facilitate story
          point estimation with the easy-to-use planning poker interface.
        </p>
        <div className='homepage__video-wrapper'>
          <video
            controls
            loop
            muted
            preload='none'
            poster='/images/planning_poker_1500_844.webp'
            id='homeVideo'
          >
            <source src='/video/planning_poker_demo.mp4' type='video/mp4' />
          </video>
          <VideoPlayBtn />
        </div>
      </section>
      <section className='homepage__direct-cta'>
        <h2 className='h1'>Try Agile Story Planning Poker Today!</h2>
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
