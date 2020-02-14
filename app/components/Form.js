import { remote } from 'electron';
import React, { useRef, useState } from 'react';
import emoji from 'node-emoji';

import styles from './Form.css';

export default function CopyExample() {
  const [value, setValue] = useState('');
  const resultRef = useRef(null);

  function copyToClipboard() {
    // select the input
    resultRef.current.select();

    console.log(resultRef.current);

    // copy the value
    document.execCommand('copy');

    // reset our value
    setValue('');

    // minimize window
    resultRef.current.focus();
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  const onKeyPress = e => {
    const keyCode = e.keyCode || e.which;

    console.log(keyCode);
    console.log(e.key);

    // check for ENTER
    if (keyCode === 13) {
      // if exact value - use it
      if (emoji.hasEmoji(value)) {
        copyToClipboard();
        // todo - minimize window
        return false;
      }
      // if the substring beings up only one item - use it
      const currentSearch = getOrSuggestEmoji(value);
      console.log(40, currentSearch);
      console.log(typeof currentSearch);
      console.log(currentSearch.length);
      if (currentSearch.length === 2) {
        console.log(34, 'enter pressed with ', value);
        copyToClipboard();
        return false;
      }
    }

    // if we get this far, add the new key to the running value
    if (e.key !== 'Enter') {
      setValue(`${value}${e.key}`);
    }
  };

  const onKeyDown = e => {
    if (window.getSelection().toString() === value) {
      setValue('');
      return false;
    }
    if (e.keyCode === 8) {
      console.log('delete');
      setValue(`${value.length >= 1 ? value.slice(0, -1) : ''}`);
    }
  };

  const onChange = e => {
    console.log(`change`, e);
  };

  const onSubmit = e => {
    e.preventDefault();
    return false;
  };

  const getOrSuggestEmoji = val => {
    if (val.length < 2) return '';
    if (emoji.hasEmoji(val)) {
      return emoji.get(val);
    }
    return emoji
      .search(val)
      .map(r => r.emoji)
      .reduce((e, t) => `${t}${e}`, '');
  };

  return (
    <div className={styles.form}>
      <form onSubmit={onSubmit}>
        <input
          focus="true"
          placeholder="Search for an emoji..."
          onKeyDown={onKeyDown}
          onKeyPress={onKeyPress}
          value={value}
          onChange={onChange}
          id="search"
        />
      </form>
      <input ref={resultRef} readOnly value={getOrSuggestEmoji(value)} />
      {/* Logical shortcut for only displaying the
          button if the copy command exists */
      document.queryCommandSupported('copy') && (
        <div>
          <button type="button" onClick={copyToClipboard}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
