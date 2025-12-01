const Card = ({ symbol, index, handleShowModal }) => {
  return (
    <button
      type='button'
      onClick={() => {
        handleShowModal(symbol);
      }}
      className={`card__wrapper card__wrapper--${index + 1 ?? 0}`}
      aria-label={
        typeof symbol === 'string' ? `${symbol} story points` : 'I need a break'
      }
    >
      <div className='card__symbol-top-left'>{symbol}</div>
      <div className='card__symbol-top-right'>{symbol}</div>
      {symbol}
      <div className='card__symbol-bottom-left'>{symbol}</div>
      <div className='card__symbol-bottom-right'>{symbol}</div>
    </button>
  );
};

export default Card;
