/***************************************************************************
 * Copyright (C) 2013 Ping Identity Corporation
 * All rights reserved.
 * 
 * The contents of this file are the property of Ping Identity Corporation.
 * You may not copy or use this file, in either source code or executable
 * form, except in compliance with terms set by Ping Identity Corporation.
 * For further information please contact:
 * 
 *     Ping Identity Corporation
 *     1001 17th Street Suite 100
 *     Denver, CO 80202
 *     303.468.2900
 *     http://www.pingidentity.com
 * 
 **************************************************************************/
package com.pingone.fuji.web.ui;

import com.pingone.fuji.web.ui.usr.AddUser;
import com.pingone.fuji.web.ui.usr.ViewUser;
import org.apache.wicket.Page;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.mapper.ResourceMapper;
import org.apache.wicket.spring.injection.annot.SpringComponentInjector;

public class FujiWebApplication 
    extends WebApplication
{
    
    public FujiWebApplication()
    {
        super();
    }
    
    @Override
    public Class<? extends Page> getHomePage()
    {
        return HomePage.class;
    }
    
    @Override
    protected void init()
    {
        super.init();
        getComponentInstantiationListeners().add(new SpringComponentInjector(this));
        mountPage("/home", HomePage.class);
        mountPage("/wicketdemo", WicketDemo.class);
        mountPage("/user/view/${email}", ViewUser.class);
        mountPage("/user/add", AddUser.class);
        mountPage("/jsdemo", JsDemo.class);
    }
    
}