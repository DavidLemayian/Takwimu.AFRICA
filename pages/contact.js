import React, { useCallback, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/styles';

import ContactContent from '../src/components/ContactContent';
import ContentPage from '../src/components/ContentPage';
import Page from '../src/components/Page';
import TableOfContent from '../src/components/ContactContent/TableOfContent';
import { getSitePage } from '../src/getTakwimuPage';

const useStyles = makeStyles({
  root: {
    marginTop: '2.875rem',
    marginBottom: '4.375rem'
  }
});

function Contact(takwimu) {
  const classes = useStyles();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const contentHeadings = [];
  const {
    page: {
      page_title: title,
      contact_title: keyContactTitle,
      contact_label: keyContactLabel,
      contacts,
      social_media_title: socialMediaTitle,
      social_media_label: socialMediaLabel,
      social_media_accounts: socialMediaAccounts,
      related_content_title: relatedContentTitle,
      related_links: relatedLinks,
      address_title: addressTitle,
      address_label: addressLabel,
      address_description: addressDescription
    },
    settings
  } = takwimu;

  const keyContacts = {
    label: keyContactLabel,
    title: keyContactTitle,
    contacts
  };
  const address = {
    label: addressLabel,
    title: addressTitle,
    description: addressDescription
  };
  const socialMedia = {
    label: socialMediaLabel,
    title: socialMediaTitle,
    accounts: socialMediaAccounts
  };
  const relatedContent = {
    title: relatedContentTitle,
    relatedLinks
  };

  let keyContactsIndex = -1;
  let addressIndex = -1;
  let socialMediaIndex = -1;
  let count = 0;
  if (keyContacts) {
    contentHeadings.push({ title: keyContacts.label, link: 'contacts' });
    keyContactsIndex = count;
    count += 1;
  }
  if (address) {
    contentHeadings.push({ title: address.label, link: 'address' });
    addressIndex = count;
    count += 1;
  }
  if (socialMedia) {
    contentHeadings.push({ title: socialMedia.label, link: 'social' });
    socialMediaIndex = count;
    count += 1;
  }

  const changeActiveContent = useCallback(
    index => {
      setCurrentSectionIndex(index);
      const activeElement = document.getElementById(
        contentHeadings[index].link
      );
      window.scrollTo(0, activeElement.offsetTop - 90);
    },
    [contentHeadings]
  );

  useEffect(() => {
    const currentIndex = contentHeadings.findIndex(
      x => x.link === window.location.hash.replace('#', '')
    );
    if (currentIndex !== -1) {
      changeActiveContent(currentIndex);
    }
  }, [changeActiveContent, contentHeadings]);

  if (count < 1) {
    return null;
  }

  return (
    <Page takwimu={takwimu} title={title}>
      <ContentPage
        aside={
          <TableOfContent
            current={currentSectionIndex}
            contentHeadings={contentHeadings}
            changeActiveContent={changeActiveContent}
          />
        }
        classes={{ root: classes.root }}
      >
        <ContactContent
          title={title}
          address={address}
          addressIndex={addressIndex}
          keyContacts={keyContacts}
          keyContactsIndex={keyContactsIndex}
          socialMedia={socialMedia}
          socialMediaIndex={socialMediaIndex}
          current={currentSectionIndex}
          contentHeadings={contentHeadings}
          relatedContent={relatedContent}
          changeActiveContent={changeActiveContent}
          settingsSocialMedia={settings.socialMedia}
          settings={settings}
        />
      </ContentPage>
    </Page>
  );
}

Contact.getInitialProps = async () => {
  return getSitePage('contact');
};

export default Contact;
