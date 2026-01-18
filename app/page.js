import { CTA, PlayingCards, VideoPlayBtn } from '../components';

export default function Home() {
  return (
    <div className='homepage__wrapper'>
      <section className='homepage__hero'>
        <div className='homepage__hero-left'>
          <h1>Online Agile Story Planning Poker</h1>
          <p>
            Invite your teammates to custom planning poker rooms for easy, fun
            and free online user story point estimation.
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
        <h2 className='h1'>Simple User Story Estimation Interface</h2>
        <p>
          Join a call on your favorite online meeting app and encourage
          collaboration and discussion among your scrum team with the
          easy-to-use user story point planning interface.
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
        <h2 className='h1'>Get started today!</h2>
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
