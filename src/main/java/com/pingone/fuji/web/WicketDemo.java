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

package com.pingone.fuji.web;

import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.model.AbstractReadOnlyModel;
import org.apache.wicket.spring.injection.annot.SpringBean;

import com.pingone.fuji.web.svc.FujiSvc;

/**
 * 
 * @author dalvizu
 */
public class WicketDemo
    extends WebPage
{
    private static final long serialVersionUID = -5936903709843445791L;

    @SpringBean
    private FujiSvc fujiSvc;
    
    public WicketDemo()
    {
        super();
        add(new Label("currentDay", new AbstractReadOnlyModel<String>()
        {

            private static final long serialVersionUID = -9190170483114408204L;

            @Override
            public String getObject()
            {
                return fujiSvc.getCurrentDate();
            }
        }));
        
        add(new Label("emailTaken", new AbstractReadOnlyModel<String>()
        {

            private static final long serialVersionUID = 394410077004796591L;

            @Override
            public String getObject()
            {
                return Boolean.toString(fujiSvc.isEmailTakenByAUser("joe@example.com"));
            }
            
        }));
    }
    
}