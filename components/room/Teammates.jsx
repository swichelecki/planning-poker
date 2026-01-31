'use client';

import { useRef, useEffect } from 'react';
import { handleRoomNameFormatting } from '../../utilities/handleRoomNameFormatting';
import { useInnerWidth } from '../../hooks';
import { CTA } from '../../components';

const Teammates = ({ teammates, room }) => {
  const teammatesListRef = useRef(null);

  const width = useInnerWidth();
  const CTABreakPoint = 1460;
  const isHideTeamList = width && width <= CTABreakPoint;

  // close teammates list when clicking someplace other than 'room info' button
  useEffect(() => {
    const handleCloseTeammatesListWhenClickingOff = (e) => {
      if (!e.target.classList.contains('teammates__cta')) {
        teammatesListRef.current.classList.add('teammates__list--hide');
      }
    };

    if (document && typeof document !== 'undefined') {
      document.addEventListener(
        'click',
        handleCloseTeammatesListWhenClickingOff,
      );

      return () => {
        document.removeEventListener(
          'click',
          handleCloseTeammatesListWhenClickingOff,
        );
      };
    }
  }, []);

  const handleOpenCloseTeamList = () => {
    if (teammatesListRef) {
      teammatesListRef.current.classList.toggle('teammates__list--hide');
    }
  };

  if (!width || !teammates || teammates?.length <= 0) return <></>;

  return (
    <>
      {isHideTeamList && (
        <CTA
          handleClick={handleOpenCloseTeamList}
          btnType='button'
          text='Room Info'
          ariaLabel='View Room Information'
          className='cta-button cta-button--small cta-button--green cta-button--bold teammates__cta'
        />
      )}
      <div
        ref={teammatesListRef}
        className={`teammates__list ${isHideTeamList ? ' teammates__list--hide' : ''}`}
      >
        <h2>{handleRoomNameFormatting(room)}</h2>
        <ul>
          {teammates?.map((teammate, index) => (
            <li key={`teammate__${index}`}>{teammate.username}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Teammates;
