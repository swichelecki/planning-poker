import { CTA, PlayingCards, VideoPlayBtn } from '../components';

export default function Home() {
  return (
    <div className='homepage__wrapper'>
      <section className='homepage__hero'>
        <div className='homepage__hero-left'>
          <h1>Express Planning Poker</h1>
          <p>
            No user account required. Begin story pointing with your team in
            seconds with this free agile story point estimation tool.
          </p>
          <CTA
            text='Plan Now'
            type='anchor'
            href='/enter'
            className='cta-button cta-button--large cta-button--bold cta-button--purple'
            ariaLabel='Get started with Express Planning Poker'
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
        <h2 className='h1'>Get started with Express Planning Poker now!</h2>
        <CTA
          text='Plan Now'
          type='anchor'
          href='/enter'
          className='cta-button cta-button--large cta-button--bold cta-button--purple'
          ariaLabel='Get started with Express Planning Poker'
        />
      </section>
    </div>
  );
}
