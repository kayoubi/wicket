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
package com.pingone.fuji.web.spring;

import java.util.Properties;

import javax.naming.NamingException;
import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.jndi.JndiObjectFactoryBean;
import org.springframework.orm.hibernate3.HibernateTransactionManager;
import org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.pingone.fuji.web.FujiWebApplication;
import com.pingone.fuji.web.dao.UserDao;
import com.pingone.fuji.web.dao.UserDaoImpl;
import com.pingone.fuji.web.svc.FujiSvc;
import com.pingone.fuji.web.svc.FujiSvcImpl;

/**
 * 
 * @author dalvizu
 */
@Configuration
@ImportResource(value = {"classpath:/com/pingone/fuji/web/spring-tx.xml"})
public class WebConfig
{
    
    @Bean
    public FujiWebApplication fujiWebApplication()
    {
        return new FujiWebApplication();
    }
    
    @Bean
    public FujiSvc fujiSvc()
    {
        return new FujiSvcImpl();
    }
    
    @Bean
    public UserDao userDao()
    {
        return new UserDaoImpl();
    }
    
    @Bean
    public SessionFactory sessionFactory()
    {
        try
        {
            final Properties properties = new Properties();
            properties.put("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
            properties.put("hibernate.hbm2ddl.auto", "create");
            final AnnotationSessionFactoryBean asfb = new AnnotationSessionFactoryBean();
            asfb.setDataSource(dataSource("jdbc/webdb"));
            asfb.setPackagesToScan(new String[] {"com.pingone.fuji.web.dao"});
            asfb.setHibernateProperties(properties);
            asfb.afterPropertiesSet();
            return asfb.getObject();
        }
        catch (final Exception x)
        {
            throw new RuntimeException(x);
        }
    }
    
    @Bean
    public PlatformTransactionManager transactionManager()
    {
        final HibernateTransactionManager xam = new HibernateTransactionManager();
        xam.setSessionFactory(sessionFactory());
        xam.afterPropertiesSet();
        return xam;
    }

    @Bean
    public TransactionTemplate transactionTemplate() 
    {
        return new TransactionTemplate(transactionManager());
    }
    
    protected DataSource dataSource(final String jndiName)
        throws NamingException
    {
        final JndiObjectFactoryBean jofb = new JndiObjectFactoryBean();
        jofb.setJndiName(jndiName);
        jofb.setProxyInterface(javax.sql.DataSource.class);
        jofb.setResourceRef(true);
        jofb.afterPropertiesSet();
        return (DataSource) jofb.getObject();
    }
}