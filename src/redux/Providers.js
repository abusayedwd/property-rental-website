"use client" 
import '@ant-design/v5-patch-for-react-19'; // antd v5 + React 19 support (modals, messages)
import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import { LanguageProvider } from '@/i18n/LanguageProvider';
 

const Providers = ({children}) => {
    return (
        <div>
             <Provider store={store}> 
                <LanguageProvider>{children}</LanguageProvider>
           </Provider>
        </div>
    );
};

export default Providers;