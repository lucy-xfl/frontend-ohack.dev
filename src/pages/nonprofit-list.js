import React from "react";


import '../styles/profile.styles.css'

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { NonProfitListTile } from "../components/nonprofit-list-tile";
import { useNonprofit } from "../hooks/use-nonprofit";

import Chip from '@mui/material/Chip';
import BuildIcon from '@mui/icons-material/Build';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import { useState, useCallback } from "react";


export const NonProfitList = () => {

    let { nonprofits } = useNonprofit();

    const [ needs_help_flag, setNeedsHelpFlag ] = useState(false);
    const [ production_flag, setProductionFlag] = useState(false);

    
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));   
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    }));


    const needsHelpButton = () =>
    {
        if( needs_help_flag )
        {
            return (<Chip icon={<BuildIcon />} color="warning" onClick={showNeedsHelp} onDelete={showNeedsHelp} label="Needs Help" />);
        }
        else{
            return (<Chip icon={<BuildIcon />} color="warning" onClick={showNeedsHelp}  label="Needs Help" />);
        }
    }

    const productionButton = () => {
        if (production_flag) {
            return (<Chip icon={<WorkspacePremiumIcon />} color="success" onClick={showProduction} onDelete={showProduction}  label="Live" />);
        }
        else {
            return (<Chip icon={<WorkspacePremiumIcon />} color="success" onClick={showProduction} label="Live" />);
        }
    }

    const showNeedsHelp = (event) =>
    {        
        setNeedsHelpFlag(!needs_help_flag)        
    }
   
    const showProduction = (event) => {
        setProductionFlag(!production_flag)
    }

    const nonProfitList = useCallback( () => {
        return(
            nonprofits.map(npo => {
                let display = true;

                let production_counter = 0;
                let needs_help_counter = 0;
                npo.problem_statements.forEach(ps => {
                    console.log(ps);

                    if ( ps.status === "production") {
                        production_counter++;
                    }
                    else{
                        needs_help_counter++;
                    }
                });

                
                if( needs_help_counter === 0 && needs_help_flag )
                {
                    display = false;
                }

                if( production_counter === 0 && production_flag )
                {
                    display = false;
                }

                if( display )
                {
                    return(<NonProfitListTile
                        key={npo.id}
                        title={npo.name}
                        description={npo.description}
                        count_problem_statements={npo.problem_statements.length}
                        need_help_problem_statement_count={needs_help_counter}
                        in_production_problem_statement_count={production_counter}
                        slack_channel={npo.slack_channel}
                        resourceUrl={`/nonprofit/${npo.id}`}
                        icon="https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/volunteer_activism/default/48px.svg"
                    />);
                }
                else{
                    return("");
                }
                
            })
        );
    }, [nonprofits, needs_help_flag, production_flag]);

    return (
        <div className="content-layout">
            <h1 className="content__title">Nonprofits</h1>
            <div className="content__body">
                <div className="profile-grid">
                    <div className="profile__header">
                        <div className="profile__headline">
                            <h2 className="profile__title">This page will contain a list of nonprofits and the problem statements we have worked on</h2>                            
                        </div>
                    </div>

                    <div className="profile__details">
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        
                        {needsHelpButton()}
                        {productionButton()}
                        

                        <div className="ohack-features">                            
                            <div className="ohack-features__grid">
                                {nonProfitList()}                                                            
                            </div>
                        </div>
                        

                    </div>
                </div>
            </div>
        </div>
    );
};
